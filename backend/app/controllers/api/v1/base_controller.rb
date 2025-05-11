module Api
  module V1
    class BaseController < ApplicationController
      # skip_before_action :verify_authenticity_token

      def current_admin
        header = request.headers['Authorization']
        return nil unless header.present?
        token = header.split(' ').last
        decoded = JsonWebToken.decode(token)
        return nil unless decoded && decoded['admin_id']
        Admin.find_by(id: decoded['admin_id'])
      end
    end
  end
end 