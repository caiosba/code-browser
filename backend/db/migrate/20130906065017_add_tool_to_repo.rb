class AddToolToRepo < ActiveRecord::Migration
  def change
    add_column :repositories, :tool, :string
  end
end
