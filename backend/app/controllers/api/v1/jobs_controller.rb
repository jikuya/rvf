module Api
  module V1
    class JobsController < BaseController
      def index
        @jobs = Job.includes(:company).all
        render json: @jobs
      end

      def create
        @job = Job.new(job_params)

        if @job.save
          render json: @job, status: :created
        else
          render json: { errors: @job.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def job_params
        params.require(:job).permit(:title, :description, :requirements, :salary_range, :location, :employment_type, :company_id)
      end
    end
  end
end
