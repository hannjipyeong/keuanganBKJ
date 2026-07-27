<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])
    ->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
        Route::get('accountpayable', function () { return inertia('accountpayable', ['pageTitle' => 'Utang Usaha']); })->name('accountpayable');
        Route::get('accountreceivable', function () { return inertia('accountreceivable', ['pageTitle' => 'Piutang Usaha']); })->name('accountreceivable');
        Route::get('generalledger', function () { return inertia('generalledger', ['pageTitle' => 'Buku Besar']); })->name('generalledger');
        Route::get('approvalworkflow', function () { return inertia('approvalworkflow', ['pageTitle' => 'Alur Persetujuan']); })->name('approvalworkflow');
        Route::get('reporting', function () { return inertia('reporting', ['pageTitle' => 'Pelaporan']); })->name('reporting');
        Route::get('financecommandcenter', function () { return inertia('financecommandcenter', ['pageTitle' => 'Pusat Komando Keuangan']); })->name('financecommandcenter');
        Route::get('reconciliation', function () { return inertia('reconciliation', ['pageTitle' => 'Rekonsiliasi']); })->name('reconciliation');
        Route::get('audittrail', function () { return inertia('audittrail', ['pageTitle' => 'Jejak Audit']); })->name('audittrail');
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
