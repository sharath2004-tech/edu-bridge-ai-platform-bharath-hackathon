import { AnalyticsChat } from '@/components/analytics-chat';
import { Card } from '@/components/ui/card';
import { getSchoolAnalyticsData, SchoolAnalytics } from '@/lib/analytics-data';

// Force dynamic rendering to avoid build-time DB access
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AnalyticsPage() {
  let schoolData: SchoolAnalytics[] = [];
  let error: string | null = null;

  try {
    schoolData = await getSchoolAnalyticsData();
  } catch (err) {
    console.error('Failed to load analytics data:', err);
    error = 'Failed to load school data';
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">School Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          AI-powered insights into school performance and trends
        </p>
      </div>

      {error ? (
        <Card className="p-6 bg-red-50 dark:bg-red-950">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </Card>
      ) : (
        <AnalyticsChat schoolData={schoolData} />
      )}

      {schoolData.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">School Performance Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">School Name</th>
                  <th className="text-right p-2">Students</th>
                  <th className="text-right p-2">Teachers</th>
                  <th className="text-right p-2">Avg Grade</th>
                  <th className="text-right p-2">Attendance</th>
                  <th className="text-right p-2">Performance</th>
                </tr>
              </thead>
              <tbody>
                {schoolData.map((school, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-2 font-medium">{school.schoolName}</td>
                    <td className="text-right p-2">{school.totalStudents}</td>
                    <td className="text-right p-2">{school.totalTeachers}</td>
                    <td className="text-right p-2">{school.averageGrade.toFixed(1)}%</td>
                    <td className="text-right p-2">{school.averageAttendance.toFixed(1)}%</td>
                    <td className="text-right p-2">
                      <span className={`px-2 py-1 rounded ${
                        school.performanceScore >= 80 ? 'bg-green-100 text-green-800' :
                        school.performanceScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {school.performanceScore.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
