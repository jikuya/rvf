require 'rails_helper'

RSpec.describe 'Companies API', type: :request do
  let!(:companies) { create_list(:company, 3) }
  let(:company_id) { companies.first.id }
  let(:valid_attributes) do
    {
      name: '新しい会社',
      email: 'new@example.com',
      password: 'password',
      description: '説明',
      website: 'https://example.com',
      industry: 'IT',
      size: '100',
      founded_year: '2020',
      location: '東京'
    }
  end

  describe 'GET /api/v1/companies' do
    it 'returns all companies' do
      get '/api/v1/companies', headers: { 'ACCEPT' => 'application/json' }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body).size).to eq(3)
    end
  end

  describe 'GET /api/v1/companies/:id' do
    it 'returns the company' do
      get "/api/v1/companies/#{company_id}", headers: { 'ACCEPT' => 'application/json' }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['id']).to eq(company_id)
    end
  end

  describe 'POST /api/v1/companies' do
    it 'creates a new company' do
      expect {
        post '/api/v1/companies', params: { company: valid_attributes }, headers: { 'ACCEPT' => 'application/json' }
      }.to change(Company, :count).by(1)
      expect(response).to have_http_status(:created)
    end
  end

  describe 'PUT /api/v1/companies/:id' do
    it 'updates the company' do
      put "/api/v1/companies/#{company_id}", params: { company: { name: '更新後の会社名' } }, headers: { 'ACCEPT' => 'application/json' }
      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['name']).to eq('更新後の会社名')
    end
  end
end
