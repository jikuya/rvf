require 'rails_helper'

RSpec.describe "JobApplications", type: :request do
  let(:company) { create(:company) }
  let(:job) { create(:job, company: company) }
  let(:job_application) { create(:job_application, job: job) }

  before do
    post '/api/v1/login', params: { email: company.email, password: 'password' }, headers: { 'ACCEPT' => 'application/json', 'Host' => 'localhost' }
    puts response.body
    @token = JSON.parse(response.body)['token']
  end

  describe "GET /api/v1/applications/:id" do
    it "returns http success" do
      get "/api/v1/applications/#{job_application.id}",
          headers: { 'Authorization' => "Bearer #{@token}" }
      expect(response).to have_http_status(:success)
    end
  end

end
