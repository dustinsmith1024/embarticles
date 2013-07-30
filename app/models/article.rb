class Article < ActiveRecord::Base
  attr_accessible :description, :headline, :link_text, :source, :title
end
