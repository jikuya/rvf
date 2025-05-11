module Api
  module V1
    class JobsController < BaseController
      before_action :set_job, only: [ :show, :update ]

      def index
        @jobs = Job.includes(:company).all
        render json: @jobs, include: :company
      end

      def show
        render json: @job, include: :company
      end

      def create
        @job = Job.new(job_params)

        if @job.save
          render json: @job, status: :created
        else
          render json: { errors: @job.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @job.update(job_params)
          render json: @job
        else
          render json: { errors: @job.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_job
        @job = Job.find(params[:id])
      end

      def job_params
        params.require(:job).permit(:title, :description, :requirements, :salary_range, :salary, :location, :employment_type, :company_id)
      end
    end
  end
end
