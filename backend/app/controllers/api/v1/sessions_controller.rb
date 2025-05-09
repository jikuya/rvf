module Api
  module V1
    class SessionsController < BaseController
      def create
        @company = Company.find_by(email: params[:email])
        if @company&.authenticate(params[:password])
          token = JsonWebToken.encode(company_id: @company.id)
          render json: { token: token, company: @company }, status: :ok
        else
          render json: { error: 'Invalid email or password' }, status: :unauthorized
        end
      end

      def destroy
        # セッションの破棄は不要（JWTを使用するため）
        render json: { message: 'Logged out successfully' }, status: :ok
      end
    end
  end
end 