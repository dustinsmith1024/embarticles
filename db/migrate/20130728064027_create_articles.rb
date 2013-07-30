class CreateArticles < ActiveRecord::Migration
  def change
    create_table :articles do |t|
      t.string :title
      t.string :headline
      t.text :description
      t.string :source
      t.string :link_text

      t.timestamps
    end
  end
end
