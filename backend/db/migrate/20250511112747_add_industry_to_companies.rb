class AddIndustryToCompanies < ActiveRecord::Migration[8.0]
  def change
    add_column :companies, :industry, :string
  end
end
