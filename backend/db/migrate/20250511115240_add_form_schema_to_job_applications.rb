class AddFormSchemaToJobApplications < ActiveRecord::Migration[8.0]
  def change
    add_column :job_applications, :form_schema, :json
  end
end
