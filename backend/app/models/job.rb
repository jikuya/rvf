class Job < ApplicationRecord
  belongs_to :company
  has_many :job_applications, dependent: :destroy

  validates :title, presence: true
  validates :description, presence: true
  validates :location, presence: true
  validates :salary, presence: true
  validates :form_definition, presence: true

  # フォーム定義のバリデーション
  validate :validate_form_definition

  private

  def validate_form_definition
    return if form_definition.blank?

    unless form_definition.is_a?(Array)
      errors.add(:form_definition, "must be an array")
      return
    end

    form_definition.each_with_index do |field, index|
      unless field.is_a?(Hash)
        errors.add(:form_definition, "field at index #{index} must be a hash")
        next
      end

      # 必須フィールドのチェック
      required_keys = %w[id type label]
      missing_keys = required_keys - field.keys.map(&:to_s)
      if missing_keys.any?
        errors.add(:form_definition, "field at index #{index} is missing required keys: #{missing_keys.join(', ')}")
      end

      # 型のチェック
      field_type = field["type"].to_s.downcase
      unless %w[text email tel number file textarea select checkbox radio].include?(field_type)
        errors.add(:form_definition, "field at index #{index} has invalid type: #{field_type}")
      end
    end
  end
end
