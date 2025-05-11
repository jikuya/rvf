require 'rails_helper'

RSpec.describe "Api::V1::Tests", type: :request do
  describe "GET /ping" do
    it "returns http success" do
      get "/api/v1/test/ping", headers: @default_headers
      expect(response).to have_http_status(:success)
    end
  end

  describe 'POST /api/v1/test/ping' do
    it '200とpongを返す' do
      post '/api/v1/test/ping', as: :json, headers: @default_headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['message']).to eq('pong')
    end
  end

end
