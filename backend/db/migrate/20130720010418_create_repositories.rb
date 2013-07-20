class CreateRepositories < ActiveRecord::Migration
  def change
    create_table :repositories do |t|
      t.string :url
      t.string :repo_url
      t.string :provider
      t.string :status
      t.text :data
      t.timestamps
    end
  end
end
