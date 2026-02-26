
import Layout from '@/components/Layout';
import { FileText, Download } from 'lucide-react';

export default function Reports() {
    const reports = [
        { name: 'Monthly Waste Analysis - October', size: '2.4 MB', date: 'Oct 31, 2023' },
        { name: 'Donor Impact Summary Q3', size: '1.1 MB', date: 'Sep 30, 2023' },
        { name: 'Distribution Efficiency Report', size: '3.5 MB', date: 'Aug 15, 2023' },
    ];

    return (
        <Layout role="analyst">
            <h1 className="text-2xl font-bold mb-6">Generated Reports</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                {reports.map((report, i) => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{report.name}</h3>
                                <p className="text-sm text-gray-500">{report.size} • Generated on {report.date}</p>
                            </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors" title="Download">
                            <Download size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </Layout>
    );
}
