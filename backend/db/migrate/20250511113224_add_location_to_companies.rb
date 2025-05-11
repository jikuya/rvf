class AddLocationToCompanies < ActiveRecord::Migration[8.0]
  def change
    add_column :companies, :location, :string
  end
end
