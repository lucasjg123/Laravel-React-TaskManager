<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'is_completed',
        'due_date',
        'list_id'
    ];

    // Esta función define una relación de pertenencia ("belongsTo") entre el modelo actual
    // y otro modelo llamado TaskList.
    public function list(): BelongsTo
    {
        //Este modelo pertenece a un TaskList.
        // La clave foránea que se usa en esta tabla es list_id.
        return $this->belongsTo(TaskList::class, 'list_id');
    }
}
