import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { publicApi } from "../services/api";
import useAuthStore from '../hooks/authStore';
import Header from "../components/Common/Hearder";
import Footer from "../components/Common/Footer";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    nom_cli: "",
    commerçant: false,
    numero_cli: "",
    adresse_cli: "",
    ville_cli: "",
    code_postal_cli: "",
    pays_cli: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const validateForm = () => {
    const newErrors = {};




    // Validation du nom et username
    if (!formData.nom_cli.trim()) newErrors.nom_cli = "Le nom est requis";
    if (!formData.username.trim())
      newErrors.username = "Le nom d'utilisateur est requis";

    // Validation de l'email
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Email invalide";
    }

    // Validation du numéro de téléphone
    if (!formData.numero_cli) {
      newErrors.numero_cli = "Le numéro de téléphone est requis";
    }

    // Validation de l'adresse
    if (!formData.adresse_cli) newErrors.adresse_cli = "L'adresse est requise";
    if (!formData.ville_cli) newErrors.ville_cli = "La ville est requise";
    if (!formData.code_postal_cli)
      newErrors.code_postal_cli = "Le code postal est requis";
    if (!formData.pays_cli) newErrors.pays_cli = "Le pays est requis";

    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères";
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Traitement spécial pour le champ "role"
    if (name === "commerçant") {
      setFormData((prev) => ({
        ...prev,
        commerçant: value === "MERCHANT" // true si MERCHANT, false si CLIENT
      }));
    } else {
      // Pour tous les autres champs, comportement normal
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      console.log("Validation du formulaire échouée");
      return;
    }

    setIsLoading(true);

    // Créer un objet avec uniquement les données nécessaires pour l'API
    const userData = {
      username: formData.username,
      email: formData.email,
      commerçant: formData.commerçant,
      password: formData.password,
      nom_cli: formData.nom_cli,
      numero_cli: formData.numero_cli,
      adresse_cli: formData.adresse_cli,
      ville_cli: formData.ville_cli,
      code_postal_cli: formData.code_postal_cli,
      pays_cli: formData.pays_cli,
      role: formData.commerçant ? "MERCHANT" : "CLIENT",
    };

    try {
      console.log("Données du formulaire envoyées:", userData);

      const response = await publicApi.post("/users/signup/", userData);
      console.log("Réponse de l'API :", response.data);

      if (response.data) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Erreur détaillée:", err);
      // Afficher l'erreur spécifique du serveur si disponible
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Une erreur est survenue lors de l'inscription. Veuillez réessayer.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const setAuth = useAuthStore((state) => state.setAuth);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await publicApi.post('/users/google/auth/', {
        credential: credentialResponse.credential
      });
      
      if (response.data.tokens) {
        setAuth(response.data.user, response.data.tokens);
        navigate('/');
      }
    } catch (err) {
      console.error('Erreur Google Auth:', err);
      setError('Erreur lors de la connexion avec Google');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          Creez votre compte
        </h1>

        <div className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4 space-y-6">
          {/* Bouton Google */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Erreur lors de la connexion avec Google')}
              text="signup_with"
              shape="rectangular"
              size="large"
            />
          </div>

          {/* Separateur */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                name="nom_cli"
                value={formData.nom_cli}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.nom_cli && (
                <p className="text-red-500 text-sm">{errors.nom_cli}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nom d utilisateur
              </label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Type de compte
            </label>
            <select
              name="commerçant"
              value={formData.commerçant}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="CLIENT">Client</option>
              <option value="MERCHANT">Commerçant</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            {errors.confirm_password && (
              <p className="text-red-500 text-sm">{errors.confirm_password}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Numéro de téléphone
            </label>
            <input
              type="text"
              name="numero_cli"
              value={formData.numero_cli}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            {errors.numero_cli && (
              <p className="text-red-500 text-sm">{errors.numero_cli}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Adresse
            </label>
            <input
              name="adresse_cli"
              value={formData.adresse_cli}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            {errors.adresse_cli && (
              <p className="text-red-500 text-sm">{errors.adresse_cli}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Ville
              </label>
              <input
                name="ville_cli"
                value={formData.ville_cli}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.ville_cli && (
                <p className="text-red-500 text-sm">{errors.ville_cli}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Code postal
              </label>
              <input
                name="code_postal_cli"
                value={formData.code_postal_cli}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              {errors.code_postal_cli && (
                <p className="text-red-500 text-sm">{errors.code_postal_cli}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Pays
            </label>
            <input
              name="pays_cli"
              value={formData.pays_cli}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            {errors.pays_cli && (
              <p className="text-red-500 text-sm">{errors.pays_cli}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Inscription en cours..." : "S'inscrire"}
          </button>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Deja un compte ?{' '}
            <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
              Connectez-vous
            </Link>
          </p>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
