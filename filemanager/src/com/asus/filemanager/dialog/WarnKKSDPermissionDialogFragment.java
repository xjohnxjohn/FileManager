package com.asus.filemanager.dialog;

import com.asus.filemanager.R;
import com.asus.filemanager.utility.ThemeUtility;

import android.app.AlertDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.TextView;

public class WarnKKSDPermissionDialogFragment extends DialogFragment{

    public static WarnKKSDPermissionDialogFragment newInstance() {
        WarnKKSDPermissionDialogFragment fragment = new WarnKKSDPermissionDialogFragment();
        return fragment;
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {

        LayoutInflater inflater = (LayoutInflater) getActivity().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        View about_view = inflater.inflate(R.layout.dialog_warn_kk_sd_permission, null);

        //String msg = getString(R.string.kk_sd_permission_warning);
        //((TextView) about_view.findViewById(R.id.msg)).setText(msg);

        int spacing_left = (int)getResources().getDimension(R.dimen.dialog_layout_spacing_left);
        int spacing_top = (int)getResources().getDimension(R.dimen.dialog_layout_spacing_top);
        int spacing_right = (int)getResources().getDimension(R.dimen.dialog_layout_spacing_right);
        int spacing_bottom = (int)getResources().getDimension(R.dimen.dialog_layout_spacing_bottom);


        AlertDialog dialog = new AlertDialog.Builder(getActivity(), ThemeUtility.getAsusAlertDialogThemeId())
            .setTitle(R.string.file_manager)
            .setPositiveButton(android.R.string.ok, null)
            .create();

        dialog.setView(about_view, spacing_left, spacing_top, spacing_right, spacing_bottom);

        return dialog;
    }
}