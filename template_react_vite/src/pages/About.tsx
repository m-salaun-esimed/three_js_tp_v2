import React, { FC, Fragment } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { FaBuilding, FaUsers, FaBriefcase, FaInfoCircle, FaExternalLinkAlt } from "react-icons/fa";
import { PiAnchorThin } from "react-icons/pi";
import Sidebar from "../components/SideBar";

const About: FC = () => {
    return (
        <Fragment>
            <Sidebar />
            <div
                className="min-h-screen transition-all duration-300 bg-gray-50 dark:bg-gray-900"
            >
                <div className="p-4 sm:p-6 sm:ml-64 min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Titre du projet */}
                        <section className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                À propos de "Nom du projet"
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                <PiAnchorThin className="inline-block w-6 h-6 mr-2" />
                                Le <strong>FANLAB</strong> est le laboratoire d'innovation de la force d'action naval. Il a été conçu pour faire de la recherche et du développement au seins de la FAN.

                            </p>
                        </section>

                        {/* Mentions légales */}
                        <section>
                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-200">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                                        <FaInfoCircle className="w-6 h-6 mr-2" />
                                        Mentions légales
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Ce projet est fornit par le <strong>FANLAB de Toulon</strong>,
                                        Le FANLab produit des preuves de concept, le logiciel "Nom du projet" ne doit pas remplacer les capacités déjà existantes mais être une plus-value. <br />
                                        Le logiciel peut contenir des erreurs majeures. Le FANLAB ne peut être tenu responsable des dommages directs ou indirects pouvant résulter de l'utilisation ou de l'impossibilité d'utiliser ce logiciel. <br />
                                    </p>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Commanditaires */}
                        <section>
                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-200">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                                        <FaUsers className="w-6 h-6 mr-2" />
                                        Commanditaires
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <li className="flex items-center space-x-4">
                                            <div>
                                                <p className="text-gray-800 dark:text-gray-100 font-medium">Toutes unitées souhaitant utiliser le logiciel</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Description du commanditaire.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Fournisseurs */}
                        <section>
                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-200">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                                        <FaBriefcase className="w-6 h-6 mr-2" />
                                        Fournisseurs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <li className="flex items-center space-x-4">
                                            <img
                                                src="/FANLAB ROND_transparent blanc.png"
                                                alt="Provider 1"
                                                className="w-12 h-12 object-contain rounded-full transition-opacity duration-200"
                                                loading="lazy"
                                            />
                                            <div>
                                                <p className="text-gray-800 dark:text-gray-100 font-medium">FANLAB</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Contact : test@test.com</p>
                                            </div>
                                        </li>
                                        <li className="flex items-center space-x-4">
                                            <div>
                                                <p className="text-gray-800 dark:text-gray-100 font-medium">Favarel clement</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Contact : test@test.com</p>
                                            </div>
                                        </li>
                                        <li className="flex items-center space-x-4">
                                            <div>
                                                <p className="text-gray-800 dark:text-gray-100 font-medium">Salaun matthieu</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Contact : test@test.com</p>
                                            </div>
                                        </li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Footer */}
                        <footer className="py-6 text-center border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-center space-x-4 mb-4">
                                <img
                                    src="/FANLAB ROND_transparent blanc.png"
                                    alt="Provider 1"
                                    className="w-12 h-12 object-contain rounded-full transition-opacity duration-200"
                                    loading="lazy"
                                />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                &copy; {new Date().getFullYear()} FANLAB. Tous droits réservés.
                            </p>
                        </footer>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default About;