FactoryBot.define do
  factory :job_application do
    sequence(:name) { |n| "応募者#{n}" }
    sequence(:email) { |n| "applicant#{n}@example.com" }
    status { 'pending' }
    association :job

    after(:build) do |job_application|
      job_application.resume.attach(
        io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'test_resume.pdf')),
        filename: 'test_resume.pdf',
        content_type: 'application/pdf'
      )
    end
  end
end
