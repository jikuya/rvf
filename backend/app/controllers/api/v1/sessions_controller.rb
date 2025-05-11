module Api
  module V1
    class SessionsController < BaseController
      # skip_forgery_protection

      def create
        @admin = Admin.find_by(email: params[:email])
        if @admin&.authenticate(params[:password])
          token = JsonWebToken.encode(admin_id: @admin.id)
          render json: { token: token, admin: @admin }, status: :ok
        else
          render json: { error: "Invalid email or password" }, status: :unauthorized
        end
      end

      def destroy
        # セッションの破棄は不要（JWTを使用するため）
        render json: { message: "Logged out successfully" }, status: :ok
      end

      def me
        if current_admin
          render json: { admin: current_admin }
        else
          render json: { error: "Not logged in" }, status: :unauthorized
        end
      end
    end
  end
end
