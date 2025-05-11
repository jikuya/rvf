require 'rails_helper'

RSpec.describe 'Api::V1::Sessions', type: :request do
  before do
    host! "localhost"
  end

  let!(:admin) { create(:admin, email: 'admin@example.com', password: 'password') }

  describe 'POST /api/v1/login' do
    context '正しい情報の場合' do
      it 'トークンと管理者情報を返す' do
        Rails.logger.debug "=== テスト開始: 正しい情報の場合 ==="
        post '/api/v1/login', params: { email: 'admin@example.com', password: 'password' }, as: :json
        Rails.logger.debug "レスポンスステータス: #{response.status}"
        Rails.logger.debug "レスポンスボディ: #{response.body}"
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['token']).to be_present
        expect(json['admin']['email']).to eq('admin@example.com')
      end
    end

    context 'パスワードが間違っている場合' do
      it '401を返す' do
        Rails.logger.debug "=== テスト開始: パスワードが間違っている場合 ==="
        post '/api/v1/login', params: { email: 'admin@example.com', password: 'wrongpass' }, as: :json
        Rails.logger.debug "レスポンスステータス: #{response.status}"
        Rails.logger.debug "レスポンスボディ: #{response.body}"
        expect(response).to have_http_status(:unauthorized)
        json = JSON.parse(response.body)
        expect(json['error']).to eq('Invalid email or password')
      end
    end

    context '存在しないメールアドレスの場合' do
      it '401を返す' do
        Rails.logger.debug "=== テスト開始: 存在しないメールアドレスの場合 ==="
        post '/api/v1/login', params: { email: 'notfound@example.com', password: 'password' }, as: :json
        Rails.logger.debug "レスポンスステータス: #{response.status}"
        Rails.logger.debug "レスポンスボディ: #{response.body}"
        expect(response).to have_http_status(:unauthorized)
        json = JSON.parse(response.body)
        expect(json['error']).to eq('Invalid email or password')
      end
    end
  end
end
