require 'rails_helper'

RSpec.describe "JobApplications", type: :request do
  describe "GET /create" do
    it "returns http success" do
      get "/job_applications/create"
      expect(response).to have_http_status(:success)
    end
  end

end
