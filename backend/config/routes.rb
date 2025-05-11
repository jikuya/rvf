Rails.application.routes.draw do
  get "job_applications/create"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check
  get "health_check" => "rails/health#show"

  # Defines the root path route ("/")
  # root "posts#index"

  namespace :api do
    namespace :v1 do
      get "test/ping"
      post "/login", to: "sessions#create"
      delete "/logout", to: "sessions#destroy"
      post "test/ping", to: "test#ping"
      get "/me", to: "sessions#me"

      resources :companies, only: [ :create ]
      resources :jobs, only: [ :index, :create ] do
        resources :applications, only: [ :create ]
      end
      resources :applications, only: [ :index, :update, :show ]
    end
  end

  resources :jobs do
  end
  resources :job_applications, only: [ :index, :create, :show, :update ]
end
