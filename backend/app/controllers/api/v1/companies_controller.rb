module Api
  module V1
    class CompaniesController < BaseController
      before_action :set_company, only: [ :show, :update ]

      def index
        @companies = Company.all
        render json: @companies
      end

      def show
        render json: @company
      end

      def create
        @company = Company.new(company_params)

        if @company.save
          render json: @company, status: :created
        else
          render json: { errors: @company.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @company.update(company_params)
          render json: @company
        else
          render json: { errors: @company.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_company
        @company = Company.find(params[:id])
      end

      def company_params
        params.require(:company).permit(:name, :email, :password, :description, :website, :industry, :size, :founded_year, :location)
      end
    end
  end
end
