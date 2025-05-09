module Api
  module V1
    class ApplicationsController < BaseController
      def index
        @applications = Application.includes(:job, :company).all
        render json: @applications.as_json(include: { 
          job: { only: [:id, :title] },
          company: { only: [:id, :name] }
        }, methods: [:resume_url])
      end

      def create
        @job = Job.find(params[:job_id])
        @application = @job.applications.build(application_params)
        
        if params[:resume].present?
          @application.resume.attach(params[:resume])
        end

        if @application.save
          render json: @application.as_json(methods: [:resume_url]), status: :created
        else
          render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        @application = Application.find(params[:id])

        if @application.update(application_params)
          render json: @application.as_json(methods: [:resume_url])
        else
          render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def application_params
        params.permit(:name, :email, :phone, :cover_letter, :status)
      end
    end
  end
end 