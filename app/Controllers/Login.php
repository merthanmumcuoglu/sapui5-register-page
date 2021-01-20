<?php namespace App\Controllers;

class Login extends BaseController
{
	public function index()
	{
	    error_reporting(1);

	    $request = service('request');
        if ($this->request->isAJAX())
        {
            if($this->request->getPost('email') && $this->request->getPost('sifre')){
                $model = new \App\Models\login();
                $email = $this->request->getPost('email');
                $sifre = $this->request->getPost('sifre');
                $veriler = ['email'=>$email,'pass'=>$sifre];
                $model->insert($veriler);
                $error = $model->errors();
                if(!$error){
                    return $this->response->setJSON([
                        'durum' => 1,
                        'mesaj' => 'Kayıt Başarıyla Oluşturuldu',
                        'email' => $email
                    ]);
                }else{
                    return $this->response->setJSON([
                        'durum' => 0,
                        'mesaj' => $error
                    ]);
                }
            }
            // ...
        }
	}

	//--------------------------------------------------------------------

}
