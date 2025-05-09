module Api
  module V1
    class BaseController < ApplicationController
      # CSRF保護のためにモジュールをインクルード
      include ActionController::RequestForgeryProtection

      # JSON API の場合は null_session が定番
      protect_from_forgery with: :null_session

      respond_to :json
    end
  end
end 