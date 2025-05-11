import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FormBuilder } from '../components/FormBuilder';
import type { FormField } from '../types/form';

interface Job {
  id: number;
  title: string;
  form_definition: FormField[];
  // 必要に応じて他の属性も追加
}

export const JobEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get<Job>(`/api/v1/jobs/${id}`);
        setJob(res.data);
      } catch (e) {
        setError('ジョブ情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSave = async (fields: FormField[]) => {
    if (!job) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await axios.patch(`/api/v1/jobs/${job.id}/update_form_definition`, {
        form_definition: fields,
      });
      setSuccess(true);
      setJob({ ...job, form_definition: fields });
    } catch (e) {
      setError('フォーム定義の保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!job) return <div>ジョブが見つかりません</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{job.title} のフォーム定義編集</h2>
      <FormBuilder
        initialFields={job.form_definition || []}
        onSave={handleSave}
      />
      {saving && <div className="text-gray-500 mt-2">保存中...</div>}
      {success && <div className="text-green-600 mt-2">保存しました！</div>}
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}; 