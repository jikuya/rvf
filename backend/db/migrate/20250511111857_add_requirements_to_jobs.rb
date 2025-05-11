class AddRequirementsToJobs < ActiveRecord::Migration[8.0]
  def change
    add_column :jobs, :requirements, :text
  end
end
