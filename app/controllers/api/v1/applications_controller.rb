module Api
  module V1
    class ApplicationsController < BaseController
      def index
        @applications = Application.includes(:job, :company).all
        render json: @applications
      end

      def create
        @application = Application.new(application_params)

        if @application.save
          render json: @application, status: :created
        else
          render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        @application = Application.find(params[:id])

        if @application.update(application_params)
          render json: @application
        else
          render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def application_params
        params.require(:application).permit(:job_id, :company_id, :name, :email, :phone, :resume_url, :cover_letter, :status)
      end
    end
  end
end 