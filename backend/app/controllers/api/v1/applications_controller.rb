module Api
  module V1
    class ApplicationsController < BaseController
      before_action :authenticate_company
      before_action :set_application, only: [:show, :update]

      def index
        @applications = current_company.job_applications.includes(:job).all
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
        @application = @job.job_applications.build(application_params.merge(company: current_company))
        
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
        @application = current_company.job_applications.find(params[:id])
      end

      def application_params
        params.permit(:name, :email, :phone, :cover_letter, :status)
      end

      def authenticate_company
        header = request.headers['Authorization']
        if header.nil?
          render json: { error: '認証が必要です' }, status: :unauthorized
          return
        end

        begin
          token = header.split(' ').last
          @decoded = JsonWebToken.decode(token)
          if @decoded.nil?
            render json: { error: 'トークンの検証に失敗しました' }, status: :unauthorized
            return
          end

          company_id = @decoded[:company_id]
          if company_id.nil?
            render json: { error: 'トークンに企業IDが含まれていません' }, status: :unauthorized
            return
          end

          @current_company = Company.find(company_id)
        rescue JWT::DecodeError => e
          render json: { error: "トークンのデコードに失敗しました: #{e.message}" }, status: :unauthorized
        rescue ActiveRecord::RecordNotFound
          render json: { error: '企業が見つかりません' }, status: :unauthorized
        end
      end

      def current_company
        @current_company
      end
    end
  end
end 