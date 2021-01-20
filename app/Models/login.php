<?php namespace App\Models;

use CodeIgniter\Model;

class login extends Model
{
    protected $table = 'veritabani';
    protected $primaryKey = 'id';

    protected $allowedFields = ['email', 'pass'];
    protected $useTimestamps = false;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';
    protected $returnType     = 'array';
    protected $useSoftDeletes = true;
    protected $validationRules    = [

        'email' => 'required|valid_email|is_unique[veritabani.email]',
        'pass' => 'required|min_length[8]'
    ];
    protected $validationMessages = [
        'email' => [
            'valid_email' => 'Email Formatında Değil',
            'is_unique' => 'Bu Email daha önce alınmış',
            'required' => 'Email Boş Bırakılamaz',
        ],
        'pass' =>[
            'required' => 'Şifre Boş Bırakılamaz',
            'min_length' => 'Şifre En Az 8 Karakter Olmalı'
        ]
    ];
    protected $skipValidation     = false;

}