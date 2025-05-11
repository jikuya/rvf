class AddFormDefinitionToJobs < ActiveRecord::Migration[8.0]
  def change
    add_column :jobs, :form_definition, :json
  end
end
