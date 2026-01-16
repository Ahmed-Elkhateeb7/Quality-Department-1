
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Product, KPIData, PageView } from '../types';
import { 
  Package, TrendingUp, Download, Eye, ShieldCheck, Clock, ArrowRight, 
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardProps {
  products: Product[];
  kpiData: KPIData[];
  handleGenerateReport: () => void;
  navigate: (view: PageView) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ products, kpiData, handleGenerateReport, navigate }) => {
  const totalProducts = products.length;
  const totalKpis = kpiData.length;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleExportCSV = () => {
    const statsHeaders = ['المقياس', 'القيمة'];
    const kpiHeaders = ['الشهر', 'معدل الجودة (%)', 'عدد العيوب'];
    const statsRows = [
        ['تقرير ملخص النظام', new Date().toLocaleDateString('ar-EG')],
        ['إجمالي المنتجات', totalProducts],
        ['إجمالي تقارير الأداء', totalKpis],
    ];
    const kpiRows = kpiData.map(d => [d.month, d.qualityRate, d.defects]);
    const csvContent = [
        '\uFEFF' + statsHeaders.join(','),
        ...statsRows.map(r => r.join(',')),
        '',
        'تحليل مؤشرات الأداء',
        kpiHeaders.join(','),
        ...kpiRows.map(r => r.join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `TQM_Dashboard_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const StatCard = ({ title, value, icon: Icon, colorClass, gradient, subtext }: any) => (
    <motion.div 
      variants={itemVariants}
      className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-500"
    >
      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${gradient}`} />
      <div className="flex justify-between items-start mb-6 relative z-10 text-right">
        <div>
          <p className="text-gray-500 text-sm font-black mb-3">{title}</p>
          <h3 className="text-6xl font-black text-gray-800 tracking-tight">{value}</h3>
        </div>
        <div className={`p-5 rounded-3xl ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
          <Icon className={`w-12 h-12 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-400 relative z-10">
        <span className="flex items-center gap-1.5 text-emerald-500 font-black bg-emerald-50 px-3 py-1 rounded-full text-xs border border-emerald-100">
           <TrendingUp className="w-4 h-4" />
           {subtext}
        </span>
        <span className="text-xs font-bold">مقارنة بالشهر الماضي</span>
      </div>
      <div className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-full ${colorClass} opacity-5 z-0`} />
    </motion.div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-12"
      dir="rtl"
    >
      {/* Header for Print only */}
      <div className="print-header hidden">
        <div className="flex items-center justify-center gap-2 mb-2">
            <ShieldCheck className="w-8 h-8 text-royal-800" />
            <h1 className="text-3xl font-black text-royal-800">تقرير الجودة الشامل</h1>
        </div>
        <p className="text-gray-500">تاريخ التقرير: {new Date().toLocaleDateString('ar-EG')}</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
        <div className="text-right">
          <h2 className="text-3xl font-black text-slate-900">نظرة عامة</h2>
          <p className="text-slate-500 mt-1">ملخص الأداء اليومي وحالة الجودة المركزية</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <button 
                onClick={() => navigate('products')}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:bg-slate-50 transition-all shadow-sm font-bold active:scale-95"
            >
                <Eye className="w-5 h-5" />
                عرض الكل
            </button>
            <button 
                onClick={handleExportCSV}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-royal-800 text-white rounded-2xl hover:bg-royal-950 transition-all shadow-xl shadow-royal-800/20 font-bold active:scale-95"
            >
                <Download className="w-5 h-5" />
                تصدير التقرير
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StatCard 
          title="إجمالي المنتجات المسجلة" 
          value={totalProducts} 
          icon={Package} 
          colorClass="text-royal-600 bg-royal-600"
          gradient="from-royal-400 to-royal-700"
          subtext="+12%"
        />
        <StatCard 
          title="إجمالي تقارير الأداء" 
          value={totalKpis} 
          icon={BarChart3} 
          colorClass="text-emerald-600 bg-emerald-600" 
          gradient="from-emerald-400 to-emerald-700"
          subtext="+5%"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 print:shadow-none print:border print:border-gray-300">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-800">مؤشر الجودة العام</h3>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl">
               <TrendingUp className="w-4 h-4" />
               تحليل الاتجاه الشهري
            </div>
          </div>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{fontSize: 12, fontWeight: 700}} tickLine={false} axisLine={false} reversed={true} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12, fontWeight: 700}} tickLine={false} axisLine={false} orientation="right" />
                <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '16px', border: 'none', color: '#fff', textAlign: 'right', fontStyle: 'Cairo' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Bar 
                    dataKey="qualityRate" 
                    name="معدل الجودة %" 
                    fill="#1e40af" 
                    radius={[8, 8, 0, 0]} 
                    barSize={40} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 print:shadow-none print:border print:border-gray-300">
          <h3 className="text-xl font-black text-slate-800 mb-8 text-right">تحليل عيوب الإنتاج</h3>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{fontSize: 12, fontWeight: 700}} tickLine={false} axisLine={false} reversed={true} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12, fontWeight: 700}} tickLine={false} axisLine={false} orientation="right" />
                <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '16px', border: 'none', color: '#fff', textAlign: 'right' }}
                    itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="defects" name="عدد العيوب" fill="#ef4444" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                <Clock className="w-6 h-6 text-slate-400" />
                أحدث المنتجات المضافة
            </h3>
            <button 
                onClick={() => navigate('products')}
                className="text-royal-600 text-sm font-black hover:text-royal-800 flex items-center gap-2 bg-royal-50 px-4 py-2 rounded-xl transition-all"
            >
                عرض كافة المنتجات <ArrowRight className="w-4 h-4" />
            </button>
         </div>
         <div className="overflow-x-auto">
             <table className="w-full text-right">
                 <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-black">
                     <tr>
                         <th className="px-8 py-5">المنتج</th>
                         <th className="px-8 py-5">المواصفات الفنية</th>
                         <th className="px-8 py-5 text-center">الإجراء</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {products.slice(0, 5).map((product) => (
                         <tr key={product.id} className="hover:bg-royal-50/30 transition-colors">
                             <td className="px-8 py-5">
                                 <div className="flex items-center gap-4">
                                     <img src={product.image} alt="" className="w-14 h-14 rounded-2xl object-cover bg-gray-100 border border-gray-100 shadow-sm" />
                                     <div className="text-right">
                                         <p className="font-black text-gray-800 text-base">{product.name}</p>
                                         <p className="text-xs text-slate-400 font-bold">معرف: #{product.id}</p>
                                     </div>
                                 </div>
                             </td>
                             <td className="px-8 py-5">
                                 <p className="text-sm text-slate-600 font-medium truncate max-w-[250px]">{product.specs}</p>
                             </td>
                             <td className="px-8 py-5 text-center">
                                 <button 
                                    onClick={() => navigate('products')}
                                    className="p-2 text-slate-400 hover:text-royal-600 hover:bg-royal-50 rounded-xl transition-all"
                                 >
                                     <Eye className="w-6 h-6" />
                                 </button>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
      </motion.div>
    </motion.div>
  );
};
