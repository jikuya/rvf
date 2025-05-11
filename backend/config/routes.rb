Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  get "health_check" => "rails/health#show"

  namespace :api do
    namespace :v1 do
      post "/login", to: "sessions#create"
      delete "/logout", to: "sessions#destroy"
      get "/me", to: "sessions#me"

      resources :companies, only: [ :index, :create, :show, :update ] do
        resources :jobs, only: [ :index ]
      end
      resources :jobs, only: [ :index, :create, :show, :update ] do
        member do
          patch :update_form_definition
        end
      end
      resources :job_applications, only: [ :index, :create, :show, :update ]
    end
  end
end
