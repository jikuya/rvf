import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Application {
  id: number;
  name: string;
  email: string;
  status: string;
  job: {
    id: number;
    title: string;
  };
  created_at: string;
  resume_url: string;
}

const ApplicationDetail: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('認証が必要です');
        }

        const response = await fetch(`/api/v1/applications/${applicationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('応募情報の取得に失敗しました');
        }

        const data = await response.json();
        setApplication(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '応募情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  const getStatusText = (status: string) => {
    const statusTexts = {
      pending: '応募済み',
      screening: '書類選考中',
      interview: '面接中',
      offer: '内定',
      rejected: '不採用',
    };
    return statusTexts[status as keyof typeof statusTexts] || status;
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
  }

  if (error || !application) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        {error || '応募情報が見つかりませんでした'}
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
        
        <h1 className="text-3xl font-bold mb-6">応募詳細</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">応募者情報</h2>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">名前：</span>
                  <span className="font-medium">{application.name}</span>
                </p>
                <p>
                  <span className="text-gray-600">メールアドレス：</span>
                  <span className="font-medium">{application.email}</span>
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-2">求人情報</h2>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">求人タイトル：</span>
                  <span className="font-medium">{application.job.title}</span>
                </p>
                <p>
                  <span className="text-gray-600">応募日時：</span>
                  <span className="font-medium">
                    {new Date(application.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">ステータス</h2>
            <p className="text-lg font-medium">{getStatusText(application.status)}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">履歴書</h2>
            {application.resume_url ? (
              <a
                href={application.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                履歴書をダウンロード
              </a>
            ) : (
              <p className="text-gray-500">履歴書はありません</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail; 