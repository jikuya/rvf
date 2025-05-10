class JobApplicationsController < ApplicationController
  def create
    @job = Job.find(params[:job_id])
    @application = @job.job_applications.build(application_params)

    if @application.save
      @application.resume.attach(params[:resume])
      render json: @application, status: :created
    else
      render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def application_params
    params.permit(:name, :email)
  end
end
