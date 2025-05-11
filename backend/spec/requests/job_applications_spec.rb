require 'rails_helper'

RSpec.describe "JobApplications", type: :request do
  let(:company) { create(:company) }
  let(:job) { create(:job, company: company) }
  let(:job_application) { create(:job_application, job: job, company: company) }

  before do
    post '/api/v1/login', params: { email: company.email, password: 'password' }, headers: @default_headers
    puts "Login response: #{response.body}"
    @token = JSON.parse(response.body)['token']
    puts "Token: #{@token}"
    puts "Company: ", company.inspect
    puts "Job: ", job.inspect
    puts "JobApplication: ", job_application.inspect
  end

  describe "GET /api/v1/applications/:id" do
    it "returns http success" do
      headers = @default_headers.merge('Authorization' => "Bearer #{@token}")
      puts "Request headers: #{headers}"
      get "/api/v1/applications/#{job_application.id}", headers: headers
      puts "Response status: #{response.status}"
      puts "Response body: #{response.body}"
      expect(response).to have_http_status(:success)
    end
  end
end
