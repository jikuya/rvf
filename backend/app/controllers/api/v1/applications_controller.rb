module Api
  module V1
    class ApplicationsController < BaseController
      before_action :authenticate_company
      before_action :set_application, only: [:show, :update]

      def index
        @applications = current_company.applications.includes(:job).all
        render json: @applications.as_json(include: { 
          job: { only: [:id, :title] }
        }, methods: [:resume_url])
      end

      def show
        render json: @application.as_json(
          include: { 
            job: { only: [:id, :title] }
          },
          methods: [:resume_url]
        )
      end

      def create
        @job = Job.find(params[:job_id])
        @application = @job.applications.build(application_params)
        
        if params[:resume].present?
          @application.resume.attach(params[:resume])
        end

        if @application.save
          ApplicationMailer.new_application_notification(@application).deliver_later
          render json: @application.as_json(methods: [:resume_url]), status: :created
        else
          render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @application.update(application_params)
          ApplicationMailer.application_status_update(@application).deliver_later
          render json: @application.as_json(
            include: { 
              job: { only: [:id, :title] }
            },
            methods: [:resume_url]
          )
        else
          render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_application
        @application = current_company.applications.find(params[:id])
      end

      def application_params
        params.permit(:name, :email, :phone, :cover_letter, :status)
      end

      def authenticate_company
        header = request.headers['Authorization']
        token = header.split(' ').last if header
        begin
          @decoded = JsonWebToken.decode(token)
          @current_company = Company.find(@decoded[:company_id])
        rescue ActiveRecord::RecordNotFound, JWT::DecodeError
          render json: { error: '認証が必要です' }, status: :unauthorized
        end
      end

      def current_company
        @current_company
      end
    end
  end
end 