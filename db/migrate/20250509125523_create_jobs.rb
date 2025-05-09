class CreateJobs < ActiveRecord::Migration[8.0]
  def change
    create_table :jobs do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.references :company, null: false, foreign_key: true

      t.timestamps
    end

    add_index :jobs, :title
  end
end
