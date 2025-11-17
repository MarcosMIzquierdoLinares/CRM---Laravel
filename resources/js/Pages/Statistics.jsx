import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layout/Layout';
import Card from '../Components/UI/Card';
import Button from '../Components/UI/Button';
import { Users, BookOpen, GraduationCap, TrendingUp, Download, PieChart } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const Statistics = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('/api/statistics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'No se pudieron cargar las estadísticas.');
      }

      setStats(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!stats) return;

    try {
      setDownloading(true);
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const { width, height } = page.getSize();

      let y = height - 50;
      const lineHeight = 18;

      page.drawText('Reporte de Estadísticas Globales', {
        x: 50,
        y,
        size: 20,
        font: titleFont,
        color: rgb(0.16, 0.33, 0.74),
      });

      y -= lineHeight * 1.5;
      page.drawText(`Generado: ${stats.generated_at}`, { x: 50, y, size: 12, font });

      y -= lineHeight * 2;
      page.drawText('Totales Generales', { x: 50, y, size: 14, font: titleFont });
      y -= lineHeight;

      Object.entries(stats.totals).forEach(([key, value]) => {
        page.drawText(`${formateLabel(key)}: ${value ?? 0}`, { x: 60, y, size: 12, font });
        y -= lineHeight;
      });

      y -= lineHeight;
      page.drawText('Usuarios por Rol', { x: 50, y, size: 14, font: titleFont });
      y -= lineHeight;

      Object.entries(stats.roles).forEach(([role, total]) => {
        page.drawText(`${role}: ${total}`, { x: 60, y, size: 12, font });
        y -= lineHeight;
      });

      y -= lineHeight;
      page.drawText('Cursos por Estado', { x: 50, y, size: 14, font: titleFont });
      y -= lineHeight;

      Object.entries(stats.courses).forEach(([status, total]) => {
        page.drawText(`${status}: ${total}`, { x: 60, y, size: 12, font });
        y -= lineHeight;
      });

      stats.schools.forEach((school) => {
        y -= lineHeight;

        if (y < 100) {
          y = height - 50;
          const newPage = pdfDoc.addPage([595.28, 841.89]);
          newPage.drawText(`Continuación - ${school.name}`, {
            x: 50,
            y,
            size: 16,
            font: titleFont,
            color: rgb(0.16, 0.33, 0.74),
          });
          y -= lineHeight * 1.5;
          newPage.drawText('Resumen por centro', { x: 50, y, size: 12, font });
          y -= lineHeight;
        }

        page.drawText(`Centro: ${school.full_name || school.name}`, { x: 50, y, size: 13, font: titleFont });
        y -= lineHeight;
        page.drawText(`Usuarios: ${school.users} | Cursos: ${school.courses} | Asignaturas: ${school.subjects}`, {
          x: 60,
          y,
          size: 12,
          font,
        });
        y -= lineHeight;
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `estadisticas_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
    } catch (err) {
      console.error('Error generating PDF', err);
      alert('No pudimos generar el PDF. Inténtalo de nuevo.');
    } finally {
      setDownloading(false);
    }
  };

  const formateLabel = (key) => {
    const map = {
      users: 'Usuarios',
      courses: 'Cursos',
      subjects: 'Asignaturas',
      grades: 'Calificaciones',
      avg_grade: 'Promedio General',
    };

    return map[key] || key;
  };

  const summaryCards = stats
    ? [
        { label: 'Usuarios', value: stats.totals.users, icon: Users, color: 'text-blue-600', badge: 'bg-blue-50 text-blue-700' },
        { label: 'Cursos', value: stats.totals.courses, icon: BookOpen, color: 'text-green-600', badge: 'bg-green-50 text-green-700' },
        { label: 'Asignaturas', value: stats.totals.subjects, icon: PieChart, color: 'text-purple-600', badge: 'bg-purple-50 text-purple-700' },
        { label: 'Promedio General', value: stats.totals.avg_grade || 0, icon: TrendingUp, color: 'text-indigo-600', badge: 'bg-indigo-50 text-indigo-700' },
      ]
    : [];

  if (!user.roles?.includes('admin')) {
    return (
      <Layout>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-700 font-medium">Solo los administradores pueden acceder a las estadísticas globales.</p>
          </div>
        </Card>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center space-y-3">
            <div className="h-10 w-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-600">Cargando estadísticas...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Card>
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="primary" onClick={fetchStatistics}>
              Reintentar
            </Button>
          </div>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="w-6 h-6 mr-2 text-blue-600" />
            Estadísticas Globales
          </h1>
          <p className="text-gray-600">Resumen actualizado del rendimiento del CRM</p>
        </div>

        <Button variant="primary" className="flex items-center" onClick={handleDownloadPdf} disabled={downloading}>
          <Download className="w-4 h-4 mr-2" />
          {downloading ? 'Generando PDF...' : 'Descargar PDF'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => (
          <Card key={card.label} className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.badge}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usuarios por rol</h3>
          <div className="space-y-4">
            {Object.entries(stats.roles).map(([role, total]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="capitalize text-gray-600">{role}</span>
                <span className="text-lg font-semibold text-gray-900">{total}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de los cursos</h3>
          <div className="space-y-4">
            {Object.entries(stats.courses).map(([status, total]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="capitalize text-gray-600">{status}</span>
                <span className="text-lg font-semibold text-gray-900">{total}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas por centro</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Centro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuarios</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cursos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asignaturas</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.schools.map((school) => (
                <tr key={school.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{school.full_name || school.name}</div>
                    <div className="text-sm text-gray-500">{school.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{school.users}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{school.courses}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{school.subjects}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  );
};

export default Statistics;

