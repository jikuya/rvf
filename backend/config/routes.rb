Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  get "health_check" => "rails/health#show"

  namespace :api do
    namespace :v1 do
      post "/login", to: "sessions#create"
      delete "/logout", to: "sessions#destroy"
      get "/me", to: "sessions#me"

      resources :companies, only: [ :create ]
      resources :jobs, only: [ :index, :create ]
      resources :job_applications, only: [ :index, :create, :show, :update ]
    end
  end
end
