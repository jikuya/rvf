require 'rails_helper'

RSpec.describe 'Jobs API', type: :request do
  let!(:company) { create(:company) }
  let!(:jobs) { create_list(:job, 3, company: company) }
  let(:job_id) { jobs.first.id }
  let(:valid_attributes) do
    {
      title: '新しい求人',
      description: '仕事内容',
      requirements: '要件',
      salary_range: '400万〜600万',
      salary: '400万〜600万',
      location: '東京',
      employment_type: 'full_time',
      company_id: company.id
    }
  end

  describe 'GET /api/v1/jobs' do
    it 'returns all jobs' do
      get '/api/v1/jobs', headers: { 'ACCEPT' => 'application/json' }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(3)
    end
  end

  describe 'GET /api/v1/jobs/:id' do
    it 'returns the job' do
      get "/api/v1/jobs/#{job_id}", headers: { 'ACCEPT' => 'application/json' }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['id']).to eq(job_id)
    end
  end

  describe 'POST /api/v1/jobs' do
    it 'creates a new job' do
      expect {
        post '/api/v1/jobs', params: { job: valid_attributes }, headers: { 'ACCEPT' => 'application/json' }
      }.to change(Job, :count).by(1)
      expect(response).to have_http_status(:created)
    end
  end

  describe 'PUT /api/v1/jobs/:id' do
    it 'updates the job' do
      put "/api/v1/jobs/#{job_id}", params: { job: { title: '更新後の求人' } }, headers: { 'ACCEPT' => 'application/json' }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['title']).to eq('更新後の求人')
    end
  end
end
