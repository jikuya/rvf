import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobApplicationForm from '../components/JobApplicationForm';

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  salary: string;
  company: string;
  created_at: string;
}

const JobDetail: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (!response.ok) {
          throw new Error('求人情報の取得に失敗しました');
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '求人情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleApplicationSubmit = () => {
    setShowApplicationForm(false);
    // 応募完了後の処理（例：成功メッセージの表示など）
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
  }

  if (error || !job) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        {error || '求人情報が見つかりませんでした'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← 戻る
        </button>
        
        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600">会社名</p>
              <p className="font-semibold">{job.company}</p>
            </div>
            <div>
              <p className="text-gray-600">勤務地</p>
              <p className="font-semibold">{job.location}</p>
            </div>
            <div>
              <p className="text-gray-600">給与</p>
              <p className="font-semibold">{job.salary}</p>
            </div>
            <div>
              <p className="text-gray-600">掲載日</p>
              <p className="font-semibold">
                {new Date(job.created_at).toLocaleDateString('ja-JP')}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">職務内容</h2>
            <p className="whitespace-pre-wrap">{job.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">応募要件</h2>
            <p className="whitespace-pre-wrap">{job.requirements}</p>
          </div>

          {!showApplicationForm ? (
            <button
              onClick={() => setShowApplicationForm(true)}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              この求人に応募する
            </button>
          ) : (
            <JobApplicationForm onSubmit={handleApplicationSubmit} />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail; 