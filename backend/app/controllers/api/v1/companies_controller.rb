module Api
  module V1
    class CompaniesController < BaseController
      def create
        @company = Company.new(company_params)

        if @company.save
          render json: @company, status: :created
        else
          render json: { errors: @company.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def company_params
        params.require(:company).permit(:name, :description, :website, :industry, :size, :founded_year, :location)
      end
    end
  end
end
