import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Application {
  id: number;
  name: string;
  email: string;
  phone: string;
  cover_letter: string;
  status: string;
  job: {
    id: number;
    title: string;
  };
  created_at: string;
  resume_url: string;
}

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(`/api/v1/applications/${id}`);
        setApplication(response.data);
      } catch (err) {
        setError('応募詳細の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!application) return;

    setUpdating(true);
    try {
      const response = await axios.patch(`/api/v1/applications/${id}`, {
        status: newStatus
      });
      setApplication(response.data);
    } catch (err) {
      setError('ステータスの更新に失敗しました。');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: '応募中',
      screening: '書類選考中',
      interview: '面接中',
      offer: '内定',
      rejected: '不採用'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          応募が見つかりませんでした。
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">応募詳細</h1>
        <button
          onClick={() => navigate('/applications')}
          className="text-blue-600 hover:text-blue-900"
        >
          ← 一覧に戻る
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">応募者情報</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">お名前</dt>
                  <dd className="mt-1 text-sm text-gray-900">{application.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">メールアドレス</dt>
                  <dd className="mt-1 text-sm text-gray-900">{application.email}</dd>
                </div>
                {application.phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">電話番号</dt>
                    <dd className="mt-1 text-sm text-gray-900">{application.phone}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">求人情報</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">求人タイトル</dt>
                  <dd className="mt-1 text-sm text-gray-900">{application.job.title}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">応募日時</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(application.created_at).toLocaleString('ja-JP')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {application.cover_letter && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">カバーレター</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {application.cover_letter}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">履歴書</h2>
            {application.resume_url ? (
              <a
                href={application.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                履歴書をダウンロード
              </a>
            ) : (
              <p className="text-sm text-gray-500">履歴書はアップロードされていません。</p>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">ステータス管理</h2>
            <div className="flex space-x-4">
              {['pending', 'screening', 'interview', 'offer', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updating || application.status === status}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    application.status === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail; 