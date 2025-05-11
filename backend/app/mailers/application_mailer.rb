class ApplicationMailer < ActionMailer::Base
  default from: "noreply@rvf.com"
  layout "mailer"

  def new_application_notification(application)
    @application = application
    @company = application.job.company
    @job = application.job

    mail(
      to: @company.email,
      subject: "新しい応募がありました: #{@job.title}"
    )
  end

  def application_status_update(application)
    @application = application
    @company = application.job.company
    @job = application.job

    mail(
      to: @application.email,
      subject: "応募ステータスが更新されました: #{@job.title}"
    )
  end
end
