class AddWebsiteToCompanies < ActiveRecord::Migration[8.0]
  def change
    add_column :companies, :website, :string
  end
end
