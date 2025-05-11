module Api
  module V1
    class JobApplicationsController < BaseController
      before_action :set_job_application, only: [ :show, :update ]

      def index
        @job_applications = JobApplication.all
        render json: @job_applications
      end

      def show
        render json: @job_application
      end

      def create
        @job_application = JobApplication.new(job_application_params)
        if @job_application.save
          render json: @job_application, status: :created
        else
          render json: { errors: @job_application.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @job_application.update(job_application_params)
          render json: @job_application
        else
          render json: { errors: @job_application.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_job_application
        @job_application = JobApplication.find(params[:id])
      end

      def job_application_params
        params.require(:job_application).permit(:name, :email, :job_id, :company_id, :status)
      end
    end
  end
end
